interface SearchPageProps {
  searchParams: {
    q?: string; // Define the expected query parameter
  };
}

export default async function Search({ searchParams }: SearchPageProps) {
  console.log(searchParams);
  const { q } = searchParams;
  return <div>{q}</div>;
}
