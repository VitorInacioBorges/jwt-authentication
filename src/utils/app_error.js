/* 
exports a error creator function that:
- creates a new Error
- assigns it the 500 status code
*/

export default function createError(message, status = 500) {
  const error = new Error(message);
  error.name = "HttpError";
  error.statusCode = status;
  return error;
}
