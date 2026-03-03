import { supabase } from "@/lib/supabaseClient";

export function getEdgeFunctionURL(function_name: string) {
    const edge_functions = process.env.NEXT_PUBLIC_EDGE_FUNCTION_URL;
    const edge_function_url = `${edge_functions}/${function_name}`;

    return edge_function_url;
}

export async function useEdgeFunction(function_name: string, variables?: Record<string, string>) : Promise<Response> {
    const authorization = await supabase.auth.getSession();

    if(!authorization.data.session) {
        throw new Error("User is not authenticated.");
    }

    const { data, error } = await supabase.functions.invoke(function_name, {
        body: {
            ...variables,
        }
    });
    console.log(data);
    if (error) throw error;
    return data;
}