function ListFood() {
  return (
    <div>
      <h2>List Surplus Food</h2>
      <div className="card">
        <input placeholder="Food name" />
        <input placeholder="Quantity" />
        <input placeholder="Freshness duration (hrs)" />
        <input placeholder="Discount price" />
        <input placeholder="Pickup time" />
        <button className="primary">Submit</button>
      </div>
    </div>
  );
}

export default ListFood;
