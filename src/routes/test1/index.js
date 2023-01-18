function GET(req, res) {
  res.json({ text: "test1 get" });
}

function OPTIONS(req, res) {
  res.json({ text: "test1 options" });
}

function POST(req, res) {
  res.json({ text: "test1 post" });
}

export { GET, OPTIONS, POST };
