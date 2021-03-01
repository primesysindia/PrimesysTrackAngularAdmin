export class FeatureAddress{
    addressId: string;
    chainage: string;
    division: string;
    featureAddressDetail: Array<{
        blockSection: string,
        distance: string,
        featureCode: string,
        featureDetail: string,
        feature_image: string,
        kiloMeter: string,
        latitude: string,
        longitude: string,
        section: string
    }>;
    fileName: string;
    line: string;
    mode: string;
    railWay: string;
    stationFrom: string;
    stationTo: string;
    trolley: string;
}