export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1); // strip leading /

    // Try R2 for any path that isn't the root
    if (path) {
      const object = await env.FILES.get(path);
      if (object) {
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        if (!headers.has("content-type")) {
          headers.set("content-type", getMimeType(path));
        }
        return new Response(object.body, { headers });
      }
    }

    // Fall through to static assets (index.html)
    return env.ASSETS.fetch(request);
  },
};

function getMimeType(path) {
  const ext = path.split(".").pop()?.toLowerCase();
  const types = {
    pdf: "application/pdf",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    zip: "application/zip",
    json: "application/json",
    css: "text/css",
    js: "application/javascript",
    html: "text/html",
    txt: "text/plain",
  };
  return types[ext] || "application/octet-stream";
}
