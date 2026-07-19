import useHotspots from "../hooks/useHotspots.js";
import SearchBar from "./SearchBar.jsx";
import Card from "./Card.jsx";
import LoadMore from "./LoadMore.jsx";
import Map from "./Map.jsx";

const Body = () => {
  const {
    hotspots,
    loading,
    error,
    query,
    totalCount,
    displayLoadMore,
    handleSearch,
    handleLoadMore,
  } = useHotspots();

  return (
    <>
      <main className="section" id="data">
        {loading && <p>Chargement...</p>}
        {error && <p>{error}</p>}
        <SearchBar onSearch={handleSearch} />
        {totalCount > 0 && (
          <p className="search-results" id="counter">
            {query
              ? `${totalCount} borne(s) trouvée(s) pour "${query}"`
              : `${totalCount} borne(s) disponibles`}
          </p>
        )}
        <div className="cards" id="born-list">
          {hotspots.map((hotspot) => (
            <Card key={hotspot.site} result={hotspot} />
          ))}
        </div>
        <LoadMore
          onLoadMore={handleLoadMore}
          displayLoadMore={displayLoadMore}
        />
        <Map hotspots={hotspots} />
      </main>
    </>
  );
};

export default Body;
