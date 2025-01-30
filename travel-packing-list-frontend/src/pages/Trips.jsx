import React, { useEffect, useState } from "react";
import { getTrips } from "../api/api"; // Vérifiez le chemin et l'import

import TripCard from "../components/TripCard";

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await getTrips();
                setTrips(data);
            } catch (error) {
                console.error("Erreur lors du chargement des voyages :", error);
                setError(
                    "Impossible de charger les voyages. Veuillez réessayer."
                );
            }
        };

        fetchTrips();
    }, []);

    return (
        <div>
            <h2 className='text-2xl font-bold mb-4'>Mes Voyages</h2>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {trips.length > 0 ? (
                    trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            destination={trip.destination}
                            startDate={trip.startDate}
                            endDate={trip.endDate}
                        />
                    ))
                ) : (
                    <p>Aucun voyage trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default Trips;
