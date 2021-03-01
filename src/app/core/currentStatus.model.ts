export class CurrentStatus{
    DeviceID: string;
    DeviceType: number;
    Name: string;
    StudentId: number;
    deviceOnStatus: number;
    parentId: number;
    lan_direction: string;
    lang: string;
    lat: string;
    lat_direction: string;
    speed: string;
    time: string;
    railFeatureDto: {
        NearByDistance: string;
        distance: string;
        featureCode: string;
        featureDetail: string;
        feature_image: string;
        kiloMeter: string;
        latitude: string;
        longitude: string;
        section: string;
    }
    location: string;
    section: string;
    showSection: boolean;
    address: string = '';
}