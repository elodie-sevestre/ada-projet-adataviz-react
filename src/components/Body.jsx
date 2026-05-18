import useHotspots from "../hooks/useHotspots.js";
import SearchBar from "./SearchBar.jsx"; // child component
import Card from "./Card.jsx"; // child component
import LoadMore from "./LoadMore.jsx"; // child component

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

        {query && (
          <p className="search-results" id="counter">
            "{totalCount} borne(s) trouvée(s)"
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
        {/* <div id="map"></div> */}
      </main>
    </>
  );
};

export default Body;
