export default function hello(request, response) {
  const { name } = request.query;
  return response.end(`Hello ${name}!`);
}
