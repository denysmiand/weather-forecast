import axios from "axios";
import { City } from "../types";
import { useQuery } from "@tanstack/react-query";

type GetCitiesProps = { search: string };

const useGetCities = ({ search }: GetCitiesProps) => {
  const fetchCitiesData = async () => {
    if (!search) return [];
    const response = await axios.get<City[]>(
      `/api/search.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${search}`
    );
    return response.data;
  };

  const { data: citiesData, isFetching: isLoadingCities } = useQuery({
    queryKey: ["cities", search],
    queryFn: fetchCitiesData,
  });
  return { citiesData, isLoadingCities };
};

export default useGetCities;
