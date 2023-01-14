function GET(req, res) {
  res.json({ text: "branch-1 get" });
}

function OPTIONS(req, res) {
  res.json({ text: "branch-1 options" });
}

function POST(req, res) {
  res.json({ text: "branch-1 post" });
}

export { GET, OPTIONS, POST };
