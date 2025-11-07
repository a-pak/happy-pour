import { get } from "http";
import { BarData } from "../model/IbarInterface";
import { getCurrentHappyHour } from "./happyHourUtil";

// NOTE: Hooks cannot be called at module scope. This util accepts the
// current `defaultDrink` value as a parameter so it can remain a pure
// function and be used anywhere.
export function getCheapestPrice(bar: BarData, defaultDrink: string): number | null {
    let cheapestPrice = Number.MAX_VALUE;

    bar.prices.forEach((price) => {
        if (price.price < cheapestPrice && (price.drinkType === defaultDrink || defaultDrink === "View all")) {
            cheapestPrice = price.price;
        }
    });
    const activeHappyHour = getCurrentHappyHour(bar);
    if(activeHappyHour) {
        activeHappyHour.prices.forEach((price) => {
            if (price.price < cheapestPrice && (price.drinkType === defaultDrink || defaultDrink === "View all")) {
                cheapestPrice = price.price;
            }
        });
    }

    return cheapestPrice === Number.MAX_VALUE ? null : cheapestPrice;
}