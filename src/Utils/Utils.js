import { PrizePerHit } from "../Components/GameManager";

export function Voucher(a, b) {
    const mapA = new Map();
    const mapB = new Map();

    a.forEach((element) => {
        mapA.set(element, (mapA.get(element) || 0) + 1);
    });

   
    b.forEach((element) => {
        mapB.set(element, (mapB.get(element) || 0) + 1);
    });

    let equalCount = 0;

    mapA.forEach((count, element) => {
        if (mapB.has(element)) {
            equalCount += Math.min(count, mapB.get(element));
        }
    });

    return {
        Matches : equalCount, 
        Prize :   equalCount < 2 ? 0 : equalCount * PrizePerHit
    };
}
