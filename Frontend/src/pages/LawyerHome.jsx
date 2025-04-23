import React from "react";
import HeroLawyer from "../components/HeroLawyer";
import Slidingeffect from '../components/Slidingeffect';
import Lawyerfeatures from '../components/Lawyerfeatures';

const LawyerHome = () => {
  return (
    <div className="bg-[#F4F4F4]">
      <HeroLawyer/>
      <Slidingeffect />
      <Lawyerfeatures />
    </div>
  );
};

export default LawyerHome;
