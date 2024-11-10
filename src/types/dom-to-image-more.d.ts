declare module "dom-to-image-more" {
  export default {
    toPng: (node: HTMLElement, options?: any) => Promise<string>,
  };
}
