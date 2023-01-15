function GET(req, res) {
  res.json({ text: "test2 get" });
}

function OPTIONS(req, res) {
  res.json({ text: "test2 options" });
}

function POST(req, res) {
  res.json({ text: "test2 post" });
}

export { GET, OPTIONS, POST };
