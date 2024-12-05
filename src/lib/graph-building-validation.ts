import { GraphBuilding, Point2D } from "../types/graph-building";

export function validateAndConvertPoint(point: unknown): Point2D {
  if (
    !Array.isArray(point) ||
    point.length !== 2 ||
    typeof point[0] !== "number" ||
    typeof point[1] !== "number"
  ) {
    throw new Error(`Invalid point format: ${JSON.stringify(point)}`);
  }
  return [point[0], point[1]];
}

export function convertToGraphBuilding(data: unknown): GraphBuilding {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid graph building data");
  }

  const rawData = data as any;

  if (!Array.isArray(rawData.levels)) {
    throw new Error("Levels must be an array");
  }

  const levels = rawData.levels.map((level: any, index: number) => {
    if (typeof level.height !== "number") {
      throw new Error(`Invalid height in level ${index}`);
    }

    // Convert points
    const points: { [key: string]: Point2D } = {};
    Object.entries(level.points || {}).forEach(([key, value]) => {
      points[key] = validateAndConvertPoint(value);
    });

    // Validate surfaces
    if (!Array.isArray(level.surfaces)) {
      throw new Error(`Invalid surfaces in level ${index}`);
    }

    // Validate spaces
    if (!Array.isArray(level.spaces)) {
      throw new Error(`Invalid spaces in level ${index}`);
    }

    return {
      height: level.height,
      points,
      surfaces: level.surfaces.map((surface: any) => ({
        id: String(surface.id),
        pointA: String(surface.pointA),
        pointB: String(surface.pointB),
      })),
      spaces: level.spaces.map((space: any) => ({
        id: String(space.id),
        outerLoop: space.outerLoop.map((loop: any) => ({
          id: String(loop.id),
          partnerId: loop.partnerId ? String(loop.partnerId) : null,
          surfaceId: String(loop.surfaceId),
          directionAToB: Boolean(loop.directionAToB),
        })),
      })),
    };
  });

  // Validate units
  if (!Array.isArray(rawData.units)) {
    throw new Error("Units must be an array");
  }

  const units = rawData.units.map((unit: any) => ({
    id: String(unit.id),
    spaceIds: unit.spaceIds.map(String),
    properties: {
      function: String(unit.properties.function),
      program: String(unit.properties.program),
    },
  }));

  return { levels, units };
}

// Example usage in your component:
export const exampleBuilding: GraphBuilding = {
  levels: [
    {
      height: 3,
      points: {
        "2aletcrtov-3jufar0w48": [0, 0],
        "221ctwjghu-3jufar0w48": [2.4757407542506655, -1.7352660799337798],
        "awpd50bekk-3jufar0w48": [7.034692257279232, -6.779449627852344],
        "2mfy4km4oq-3jufar0w48": [8.916877461044265, -5.078323770284385],
        "uxr8ym0kcp-3jufar0w48": [2.9552994824935297, 1.5177748148969954],
      },
      surfaces: [
        {
          id: "7wutt6jipb-3jufar0w48",
          pointA: "2aletcrtov-3jufar0w48",
          pointB: "221ctwjghu-3jufar0w48",
        },
        {
          id: "ndc69lm1qu-3jufar0w48",
          pointA: "221ctwjghu-3jufar0w48",
          pointB: "awpd50bekk-3jufar0w48",
        },
        {
          id: "8kzlnfi99p-3jufar0w48",
          pointA: "awpd50bekk-3jufar0w48",
          pointB: "2mfy4km4oq-3jufar0w48",
        },
        {
          id: "2mdny9y9gh-3jufar0w48",
          pointA: "2mfy4km4oq-3jufar0w48",
          pointB: "uxr8ym0kcp-3jufar0w48",
        },
        {
          id: "20gdvu7qws-3jufar0w48",
          pointA: "uxr8ym0kcp-3jufar0w48",
          pointB: "2aletcrtov-3jufar0w48",
        },
      ],
      spaces: [
        {
          id: "vwua9sraif-3jufar0w48",
          innerLoops: [],
          outerLoop: [
            {
              id: "vwua9sraif-7wutt6jipb-3jufar0w48",
              surfaceId: "7wutt6jipb-3jufar0w48",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-ndc69lm1qu-3jufar0w48",
              surfaceId: "ndc69lm1qu-3jufar0w48",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-8kzlnfi99p-3jufar0w48",
              surfaceId: "8kzlnfi99p-3jufar0w48",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-2mdny9y9gh-3jufar0w48",
              surfaceId: "2mdny9y9gh-3jufar0w48",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-20gdvu7qws-3jufar0w48",
              surfaceId: "20gdvu7qws-3jufar0w48",
              directionAToB: true,
              partnerId: null,
            },
          ],
        },
      ],
    },
    {
      height: 3,
      points: {
        "2aletcrtov-2oka0dxiw2": [0, 0],
        "221ctwjghu-2oka0dxiw2": [2.4757407542506655, -1.7352660799337798],
        "awpd50bekk-2oka0dxiw2": [7.034692257279232, -6.779449627852344],
        "2mfy4km4oq-2oka0dxiw2": [8.916877461044265, -5.078323770284385],
        "uxr8ym0kcp-2oka0dxiw2": [2.9552994824935297, 1.5177748148969954],
      },
      surfaces: [
        {
          id: "7wutt6jipb-2oka0dxiw2",
          pointA: "2aletcrtov-2oka0dxiw2",
          pointB: "221ctwjghu-2oka0dxiw2",
        },
        {
          id: "ndc69lm1qu-2oka0dxiw2",
          pointA: "221ctwjghu-2oka0dxiw2",
          pointB: "awpd50bekk-2oka0dxiw2",
        },
        {
          id: "8kzlnfi99p-2oka0dxiw2",
          pointA: "awpd50bekk-2oka0dxiw2",
          pointB: "2mfy4km4oq-2oka0dxiw2",
        },
        {
          id: "2mdny9y9gh-2oka0dxiw2",
          pointA: "2mfy4km4oq-2oka0dxiw2",
          pointB: "uxr8ym0kcp-2oka0dxiw2",
        },
        {
          id: "20gdvu7qws-2oka0dxiw2",
          pointA: "uxr8ym0kcp-2oka0dxiw2",
          pointB: "2aletcrtov-2oka0dxiw2",
        },
      ],
      spaces: [
        {
          id: "vwua9sraif-2oka0dxiw2",
          innerLoops: [],
          outerLoop: [
            {
              id: "vwua9sraif-7wutt6jipb-2oka0dxiw2",
              surfaceId: "7wutt6jipb-2oka0dxiw2",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-ndc69lm1qu-2oka0dxiw2",
              surfaceId: "ndc69lm1qu-2oka0dxiw2",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-8kzlnfi99p-2oka0dxiw2",
              surfaceId: "8kzlnfi99p-2oka0dxiw2",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-2mdny9y9gh-2oka0dxiw2",
              surfaceId: "2mdny9y9gh-2oka0dxiw2",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-20gdvu7qws-2oka0dxiw2",
              surfaceId: "20gdvu7qws-2oka0dxiw2",
              directionAToB: true,
              partnerId: null,
            },
          ],
        },
      ],
    },
    {
      height: 3,
      points: {
        "2aletcrtov-2p5xy7knkm": [0, 0],
        "221ctwjghu-2p5xy7knkm": [2.4757407542506655, -1.7352660799337798],
        "awpd50bekk-2p5xy7knkm": [7.034692257279232, -6.779449627852344],
        "2mfy4km4oq-2p5xy7knkm": [8.916877461044265, -5.078323770284385],
        "uxr8ym0kcp-2p5xy7knkm": [2.9552994824935297, 1.5177748148969954],
      },
      surfaces: [
        {
          id: "7wutt6jipb-2p5xy7knkm",
          pointA: "2aletcrtov-2p5xy7knkm",
          pointB: "221ctwjghu-2p5xy7knkm",
        },
        {
          id: "ndc69lm1qu-2p5xy7knkm",
          pointA: "221ctwjghu-2p5xy7knkm",
          pointB: "awpd50bekk-2p5xy7knkm",
        },
        {
          id: "8kzlnfi99p-2p5xy7knkm",
          pointA: "awpd50bekk-2p5xy7knkm",
          pointB: "2mfy4km4oq-2p5xy7knkm",
        },
        {
          id: "2mdny9y9gh-2p5xy7knkm",
          pointA: "2mfy4km4oq-2p5xy7knkm",
          pointB: "uxr8ym0kcp-2p5xy7knkm",
        },
        {
          id: "20gdvu7qws-2p5xy7knkm",
          pointA: "uxr8ym0kcp-2p5xy7knkm",
          pointB: "2aletcrtov-2p5xy7knkm",
        },
      ],
      spaces: [
        {
          id: "vwua9sraif-2p5xy7knkm",
          innerLoops: [],
          outerLoop: [
            {
              id: "vwua9sraif-7wutt6jipb-2p5xy7knkm",
              surfaceId: "7wutt6jipb-2p5xy7knkm",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-ndc69lm1qu-2p5xy7knkm",
              surfaceId: "ndc69lm1qu-2p5xy7knkm",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-8kzlnfi99p-2p5xy7knkm",
              surfaceId: "8kzlnfi99p-2p5xy7knkm",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-2mdny9y9gh-2p5xy7knkm",
              surfaceId: "2mdny9y9gh-2p5xy7knkm",
              directionAToB: true,
              partnerId: null,
            },
            {
              id: "vwua9sraif-20gdvu7qws-2p5xy7knkm",
              surfaceId: "20gdvu7qws-2p5xy7knkm",
              directionAToB: true,
              partnerId: null,
            },
          ],
        },
      ],
    },
  ],
  units: [
    {
      id: "3bzrksvyab",
      spaceIds: ["vwua9sraif-3jufar0w48"],
      properties: {},
    },
    {
      id: "3oku14c9yf",
      spaceIds: ["vwua9sraif-2oka0dxiw2"],
      properties: {},
    },
    {
      id: "14rlgivha9",
      spaceIds: ["vwua9sraif-2p5xy7knkm"],
      properties: {},
    },
  ],
};
