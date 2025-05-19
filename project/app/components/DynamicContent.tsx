'use client';

import { useEffect, useState } from "react";
import { RoomTypeDetail } from "@/types/roomTypes";
import { PackageType } from "@/types/reservationtypes";
import { Activity } from "../services/activityService";
import { getRoomTypes } from "../services/roomTypeService";
import { packageTypeService } from "../services/packageTypeService";
import { activityService } from "../services/activityService";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DynamicContent() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeDetail[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [roomTypesData, packagesData, activitiesData] = await Promise.all([
          getRoomTypes(),
          packageTypeService.getAllPackageTypes(),
          activityService.getAllActivities()
        ]);
        
        setRoomTypes(roomTypesData);
        setPackages(packagesData);
        setActivities(activitiesData);
        console.log('Fetched data:', { roomTypesData, packagesData, activitiesData });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add helper function for price formatting
  const formatPrice = (price: number | undefined | null) => {
    return price ? price.toLocaleString() : '0';
  };

  return (
    <>
      {/* Room Types Preview */}
      <section className="py-20 px-4 bg-background" id="rooms">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Accommodations</h2>
          {isLoading ? (
            <div className="text-center">Loading rooms...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomTypes.map((roomType) => (
                <div
                  key={roomType.TypeID}
                  className="group bg-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <div
                  className="h-64 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(/uploads/room-types/${roomType.Image || 'default-room.jpg'})`
                  }}
                  />
                  <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{roomType.Name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">{roomType.Description}</p>
                    <p className="text-sm text-muted-foreground">Max Occupancy: {roomType.MaxPeople || 0} Persons</p>
                    <p className="text-sm font-semibold text-primary">
                    Price: LKR {formatPrice(roomType.LocalPrice)} / USD {formatPrice(roomType.ForeignPrice)}
                    </p>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/OnlineBooking">
                Plan Your Stay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 bg-muted" id="packages">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Stay Packages</h2>
          {isLoading ? (
            <div className="text-center">Loading packages...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.PackageID}
                  className={`bg-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                    pkg.Name === 'Half Board' ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">{pkg.Name}</h3>
                    <p className="text-xl font-bold text-primary mb-6">
                      From LKR {formatPrice(pkg.LocalPrice)} / USD {formatPrice(pkg.ForeignPrice)}
                    </p>
                    <div className="space-y-3 mb-6">
                      <p className="text-sm text-muted-foreground">{pkg.Description}</p>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={pkg.Name === 'Half Board' ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/OnlineBooking">Select Package</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 px-4 bg-muted" id="activities">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Adventure Awaits</h2>
          {isLoading ? (
            <div className="text-center">Loading activities...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <div
                  key={activity.ActivityID}
                  className="group bg-card rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                >
                  <div
                    className="h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${activity.Image || '/default-activity.jpg'})` }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{activity.Name}</h3>
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-muted-foreground">{activity.Description}</p>
                      <p className="text-sm text-muted-foreground">
                        Price: LKR {formatPrice(activity.LocalPrice)} / USD {formatPrice(activity.ForeignPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}