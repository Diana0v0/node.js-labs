function GET(req, res) {
  res.json({ text: "test3 get" });
}

function OPTIONS(req, res) {
  res.json({ text: "test3 options" });
}

function POST(req, res) {
  res.json({ text: "test3 post" });
}

export { GET, OPTIONS, POST };
