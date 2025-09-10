declare const _default: (() => {
    url: string;
    host?: undefined;
    port?: undefined;
    password?: undefined;
    db?: undefined;
} | {
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    url?: undefined;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string;
    host?: undefined;
    port?: undefined;
    password?: undefined;
    db?: undefined;
} | {
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    url?: undefined;
}>;
export default _default;
