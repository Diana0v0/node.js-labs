function GET(req, res, url, payload) {
  res.json({ text: "root get", url });
}

function OPTIONS(req, res) {
  res.json({ text: "root options" });
}

function POST(req, res, url, payload) {
  res.json({
    text: "root post",
    contentType: req.headers["content-type"],
    payload,
  });
}

export { GET, OPTIONS, POST };
