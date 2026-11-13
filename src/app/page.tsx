"use client";

import { HomeRoot } from "./_sections/home/Home.styles";
import HomeHero from "./_sections/home/HomeHero";
import {
  HomeShortcuts,
  HomeDiscography,
  HomeUpcoming,
  HomeCommunity,
} from "./_sections/home/HomeSections";

export default function Home() {
  return (
    <HomeRoot>
      <HomeHero />
      <HomeShortcuts />
      <HomeDiscography />
      <HomeUpcoming />
      <HomeCommunity />
    </HomeRoot>
  );
}
