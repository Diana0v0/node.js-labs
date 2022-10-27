export default function hello(req, res) {
  const { name = "world" } = req.query;
  return res.send(`Hello ${name}!`);
}
