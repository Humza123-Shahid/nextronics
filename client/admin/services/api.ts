const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = options.body instanceof FormData;

    // Dynamically build headers: omit Content-Type if uploading FormData
    const headers: Record<string, string> = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // if (!response.ok) {
    //     const errorData = await response.json().catch(() => ({}));
    //     console.error("Backend API Error:", errorData);

    //     const errorMessage =
    //         errorData.detail ||
    //         (typeof errorData === "object" ? JSON.stringify(errorData) : null) ||
    //         `Request failed with status ${response.status}`;

    //     throw new Error(errorMessage);
    // }
    if (!response.ok) {
        //// 1. Capture the raw text in case it's not valid JSON
        const rawText = await response.text().catch(() => "");
        let errorData: any = {};
        try { errorData = JSON.parse(rawText); } catch { errorData = { rawMessage: rawText }; }

        console.error("Backend API Error:", response.status, errorData);

        throw new Error(
            errorData.detail ||
            errorData.message ||
            errorData.rawMessage ||
            `HTTP Error ${response.status}`
        );
        // const rawText = await response.text().catch(() => "");

        // let errorData = {};
        // try {
        //     errorData = JSON.parse(rawText);
        // } catch {
        //     errorData = { rawMessage: rawText };
        // }

        // // 2. Enhanced logging to see what went wrong
        // console.error("Backend API Error Status:", response.status);
        // console.error("Backend API Error Data:", errorData);

        // //     const errorMessage =
        // //         errorData.detail ||
        // //         errorData.message ||
        // //         errorData.rawMessage ||
        // //         `HTTP Error ${response.status}`;

        // //     throw new Error(errorMessage);
        // // }

    }
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
    // const responseBody = await response.text();
    // let data;
    // try {
    //     data = responseBody ? JSON.parse(responseBody) : null;
    // } catch {
    //     data = responseBody;
    // }

    // if (!response.ok) {
    //     console.error("Backend API Error Status:", response.status);
    //     console.error("Backend API Error Data:", data);
    //     throw new Error(`API Error: ${response.status}`);
    // }

    // return data;
}

export const api = {
    get: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),

    getWithToken: <T>(endpoint: string, token: string) =>
        apiRequest<T>(endpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }),

    post: <T>(endpoint: string, body: any, token?: string) =>
        apiRequest<T>(endpoint, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    postWithToken: <T>(endpoint: string, body: any, token: string) =>
        apiRequest<T>(endpoint, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: any, token?: string) =>
        apiRequest<T>(endpoint, {
            method: "PUT",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: any, token?: string) =>
        apiRequest<T>(endpoint, {
            method: "PATCH",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    patchWithToken: <T>(endpoint: string, body: any, token: string) =>
        apiRequest<T>(endpoint, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),

    delete: <T>(endpoint: string, token?: string) =>
        apiRequest<T>(endpoint, {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),

    deleteWithToken: <T>(endpoint: string, token: string) =>
        apiRequest<T>(endpoint, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }),
};