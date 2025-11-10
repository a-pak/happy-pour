import { BarData } from "../model/IbarInterface";
import { getCurrentHappyHour } from "./happyHourUtil";

// NOTE: Hooks cannot be called at module scope. This util accepts the
// current `defaultDrink` value as a parameter so it can remain a pure
// function and be used anywhere.
export function getCheapestPrice(bar: BarData, defaultDrink: string): number | null {
    let cheapestPrice = Number.MAX_VALUE;

    bar.prices.forEach((price) => {
        if (price.price < cheapestPrice && (price.drinkType === defaultDrink)) {
            cheapestPrice = price.price;
        }
    });
    const activeHappyHour = getCurrentHappyHour(bar);
    if (activeHappyHour) {
        activeHappyHour.prices.forEach((price) => {
            if (price.price < cheapestPrice && (price.drinkType === defaultDrink)) {
                cheapestPrice = price.price;
            }
        });
    }

    return cheapestPrice === Number.MAX_VALUE ? null : cheapestPrice;
}

export enum PriceRank {HIGH, MIDDLE, LOW}
export function getPriceRank(bars : BarData[], price : number, defaultDrink: string) : PriceRank {
    let priceArray : number[] = [];
    bars.forEach((bar) => {
        const cheapest = getCheapestPrice(bar, defaultDrink)
        cheapest ? priceArray.push(cheapest) : null;
    })
    priceArray.sort((a, b) => a - b);
    const n : number= priceArray.length;
    const firstThird = Math.floor(n / 3), secondThird = Math.floor((2 * (n/3)));

    if(price <= priceArray[firstThird]) return PriceRank.LOW
    else if (price <= priceArray[secondThird]) return PriceRank.MIDDLE
    else return PriceRank.HIGH
}

// Sum of prices / amount.
export function getPriceAverage(bars: BarData[]): number {
    if (bars.length === 0) return 0;

    let totalSum: number = 0, amount: number = 0;
    bars.forEach((bar) => {
        bar.prices.forEach((p) => {
            totalSum = + p;
            amount++;
        })
        const activeHappyHour = getCurrentHappyHour(bar);
        if (activeHappyHour) {
            activeHappyHour.prices.forEach((p) => {
                totalSum = + p;
                amount++;
            })
        }
    })
    return (totalSum / amount);
}