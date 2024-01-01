import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetails } from "../api";

const useUser = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "user",
        async () => {
            try {
                const userDetails = await getUserDetails();
                return userDetails;
            } catch (error) {
                if (!error.message.includes("not authenticated")) {
                    toast.error("Something Went Wrong");
                }
                throw error; // Re-throw the error for React Query to handle
            }
        },
        { refetchOnWindowFocus: false }
    );

    // Return an object instead of using parentheses
    return { data, isLoading, isError, refetch };
};

export default useUser;
