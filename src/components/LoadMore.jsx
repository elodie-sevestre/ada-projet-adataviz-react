function LoadMore({ onLoadMore, displayLoadMore }) {
  if (!displayLoadMore) return null;
  return (
    <button className="btn" onClick={onLoadMore}>
      Charger plus
    </button>
  );
}

export default LoadMore;
