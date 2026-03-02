import { EdgeFunctionOptions, ApiMethod } from "@/lib/types/api_types";
import { supabase } from "@/lib/supabaseClient";

export function getEdgeFunctionURL(function_name: string) {
    const edge_functions = process.env.NEXT_PUBLIC_EDGE_FUNCTION_URL;
    const edge_function_url = `${edge_functions}/${function_name}`;

    return edge_function_url;
}

function getAuthHeaders(token: string): Record<string, string> {
    return {
        "Authorization": `Bearer ${token}`
    }
}

export async function fetchEdgeFunction(function_name: string, method: ApiMethod, headers?: Record<string, string>) : Promise<Response> {
    const edge_function_url = getEdgeFunctionURL(function_name);
    const authorization = await supabase.auth.getSession();

    if(!authorization.data.session) {
        throw new Error("User is not authenticated.");
    }

    const options: EdgeFunctionOptions = {
        method,
        headers: {
        ...headers,
        "Authorization": `Bearer ${authorization.data.session.access_token}`,
        }
    }

    console.log(options)

    const response = await fetch(edge_function_url, options);
    return response;
}