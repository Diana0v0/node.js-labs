function GET(req, res) {
  res.json({ text: "branch-3 get" });
}

function OPTIONS(req, res) {
  res.json({ text: "branch-3 options" });
}

function POST(req, res) {
  res.json({ text: "branch-3 post" });
}

export { GET, OPTIONS, POST };
