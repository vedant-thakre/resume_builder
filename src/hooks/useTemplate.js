import { useQuery } from "react-query"
import { toast } from "react-toastify";
import { getTemplates } from "../api";

// added changes okay
const useTemplates = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "templates",
        async () => {
            try {
                const templates = await getTemplates();
                console.log(templates);
                return templates;
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong");
            }
        },
        { refetchOnWindowFocus: false}
    );

    return {
        data, 
        isError, 
        isLoading,
        refetch,
    }
}


export default useTemplates;