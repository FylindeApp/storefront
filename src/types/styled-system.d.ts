// styled-system.d.ts
declare module "@styled-system/theme-get" {
    export function themeGet(path: string, fallback?: any): (props: any) => any;
}

declare module "@styled-system/css" {
    export default function css(styles: any): any;
}
