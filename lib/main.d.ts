interface CfgItem {
    name: string;
    where: string;
}
export declare const VitePluginInjectWasm: (cfg: Array<CfgItem>) => {
    name: string;
    configureServer(_server: any): void;
    transform(code: string, id: string): Promise<any> | undefined;
};
export {};
