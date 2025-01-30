const TripCard = ({ destination, startDate, endDate }) => {
    return (
        <div className='bg-white shadow p-4 rounded'>
            <h3 className='font-bold text-lg'>{destination}</h3>
            <p className='text-gray-500'>
                {startDate} - {endDate}
            </p>
        </div>
    );
};

export default TripCard;
