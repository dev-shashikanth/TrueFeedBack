type JsonResponseExtras = Record<string, unknown>;

export const sendJsonResponse = (
  success: boolean,
  message: string,
  status: number,
  extras: JsonResponseExtras = {}
) => {
  return new Response(
    JSON.stringify({
      success,
      message,
      ...extras,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
};
