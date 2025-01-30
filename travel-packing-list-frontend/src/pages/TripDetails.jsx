import ItemCard from "../components/ItemCard";

const TripDetails = () => {
    const items = [
        { id: 1, name: "Passport", quantity: 1, status: true },
        { id: 2, name: "Laptop", quantity: 1, status: false },
    ];

    return (
        <div>
            <h2 className='text-2xl font-bold mb-4'>Détails du Voyage</h2>
            <div className='grid gap-4'>
                {items.map((item) => (
                    <ItemCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default TripDetails;
