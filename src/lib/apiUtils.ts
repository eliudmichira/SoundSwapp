export async function resilientApiRequest<T>(
  url: string, 
  options: RequestInit = {}, 
  retryCount = 0,
  maxRetries = 3
): Promise<T> {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401 && retryCount < maxRetries) {
        // Token expired, attempt refresh and retry
        return resilientApiRequest<T>(url, options, retryCount + 1, maxRetries);
      }
      
      // Parse error response
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch {}
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: unknown) {
    // Handle network errors with exponential backoff
    if (error instanceof TypeError && error.message.includes('network') && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s, etc.
      console.log(`Network error, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return resilientApiRequest<T>(url, options, retryCount + 1, maxRetries);
    }
    
    // Handle timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your network connection.');
    }
    
    throw error instanceof Error ? error : new Error(String(error));
  }
} 