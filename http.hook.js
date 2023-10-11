import { useCallback } from "react";

export default function useHttp() {

  const request = useCallback(async (url, method = 'GET', body = null, headers) => {
    body = body ? JSON.stringify(body) : null
    headers = {
      'Content-Type': 'application/json;charset=utf-8', 
      'Accept': 'application/json',
      ...headers
    }
    try {

      const  response = await fetch(url, { method, headers, body })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}.\n Сообщение от сервера: ${data.message}`)
      }
      return data
    
    } catch(e) {
      throw e
    }
  }, [])
  
  return {request}
}