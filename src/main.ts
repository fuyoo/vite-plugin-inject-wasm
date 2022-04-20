const {copyFile,stat} = require("fs")
const {join, basename, dirname} = require("path")

const dgram  = require("dgram")

const ipv4 = async() => {
    return new Promise<string>((resolve, reject) => {
        if (Number(process.version.split(".")[0].replace('v','')) < 12) {
            reject('node.js version must be >= 12.0.0')
            return
        }
        const socket = dgram.createSocket('udp4')
        socket.connect(80, '4.2.2.1', () => {
            resolve(socket.address().address)
            socket.close()
        })
        socket.on('error', () => resolve('127.0.0.1'))
    })
}


// https://vitejs.dev/config/
interface CfgItem {
    name: string,
    where: string
}


export const VitePluginInjectWasm = (cfg: Array<CfgItem>) => {
    let host:string;
    let server: any;
    return {
        name: "vite-plugin-inject-wasm",
        configureServer(_server: any) {
            if (!server) {
                server = _server
            }
        },
        transform(code: string, id: string) {
            try {
                for (let item of cfg) {
                    let v = new URL(`http://localohost/${id}`).searchParams.get("v")
                    let pid = item.name.replace(/\//g, "_")
                    if (id.indexOf(`${pid}.js`) > -1) {
                        return new Promise<any>(async (resolve, reject) => {
                            if (server != null) {
                                if (!host) {
                                // get listen host
                                host = server.config.server.host ? await ipv4() : "127.0.0.1"
                                }
                                // get package path
                                let from_path = join(server.config.root, 'node_modules', item.name, item.where)
                                // get save filename
                                let to_filename = `${item.name}_${basename(item.where)}`.replace("/", "_")
                                // get copy to file path
                                let to_path = join(dirname(id), to_filename)
                                // check file is existed?
                                let exists = await new Promise((resolve) => {
                                    stat(to_path, (err:any, stats:any) => {
                                        if(!err) {
                                            resolve(true);
                                        } else {
                                            resolve(false)
                                        }
                                    })
                                })
                                // get code replace path from the cache dir
                                let url_path = to_path.replace(server.config.root, "")
                                // get server schema
                                let schema = server.config.server.https ? "https" : "http"
                                // change body
                                code = code.replace(basename(item.where),
                                    `${schema}://${host}:${server.config.server.port}${url_path}?v=${v}`);
                                // existed
                                if (exists) {
                                    resolve(code)
                                } else {
                                    // cp ***.wasm file to vite cache dir
                                    copyFile(from_path, to_path, (err: any) => {
                                        if (err == null) {
                                            resolve(code)
                                        } else {
                                            reject(err)
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }
    }


}
