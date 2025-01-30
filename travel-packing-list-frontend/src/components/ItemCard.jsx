const ItemCard = ({ name, quantity, status }) => {
    return (
        <div
            className={`p-4 rounded ${status ? "bg-green-100" : "bg-red-100"}`}>
            <h4 className='font-bold'>{name}</h4>
            <p>Quantité : {quantity}</p>
            <p>Status : {status ? "Pris" : "Non pris"}</p>
        </div>
    );
};

export default ItemCard;
