/** An .html file imported as a string. See the webpack rule in next.config.mjs. */
declare module "*.html" {
  const content: string;
  export default content;
}
