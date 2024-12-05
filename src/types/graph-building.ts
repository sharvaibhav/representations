export type Point2D = [number, number];

export type Surface = {
  id: string;
  pointA: string;
  pointB: string;
};

export type CoSurface = {
  id: string;
  partnerId: string | null;
  surfaceId: string;
  directionAToB: boolean;
};

export type Space = {
  id: string;
  outerLoop: CoSurface[];
};

export type Level = {
  height: number;
  points: { [key: string]: Point2D };
  surfaces: Surface[];
  spaces: Space[];
};

export type Unit = {
  id: string;
  spaceIds: string[];
  properties: {
    function: string;
    program: string;
  };
};

export type GraphBuilding = {
  levels: Level[];
  units: Unit[];
};
