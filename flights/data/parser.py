import numpy as np
import pandas as pd


clat = 0
clon = 0
ww = 1280
hh = 720
zoom = 1.4


def mercX(lon):
    lon = np.radians(lon)
    a = (256 / np.pi) * np.power(zoom, 2)
    b = lon + np.pi
    return a * b


def mercY(lat):
    lat = np.radians(lat)
    a = (256 / np.pi) * np.power(zoom, 2)
    b = np.tan(np.pi / 4 + lat / 2)
    c = np.pi - np.log(b)
    return a * c


def coord2pos(lat, lon):
    cx = mercX(clon)
    cy = mercY(clat)

    x = mercX(lon) - cx
    y = mercY(lat) - cy

    if (x < -ww/2):
        x += ww
    elif (x > ww/2):
        x -= ww

    return [str(x), str(y)]


def main():
    output = open("flights.csv", "w")
    airports = pd.read_csv("airports.csv", nrows=7185)
    routes = pd.read_csv("routes.csv", nrows=67664)
    coordinates = {}

    for row in airports.itertuples():
        id = getattr(row, "id")
        lat = getattr(row, "lat")
        lon = getattr(row, "lon")
        coordinates[id] = [lat, lon]

    for row in routes.itertuples():
        # get airports ids
        src = getattr(row, "src_id")
        dest = getattr(row, "dest_id")

        try:
            src = int(src)
            dest = int(dest)
        except Exception as e:
            # print(e)
            pass
        else:
            # get airports coordinates
            try:
                src_coord = coord2pos(coordinates[src][0], coordinates[src][1])
                dest_coord = coord2pos(coordinates[dest][0], coordinates[dest][1])
                output.write(src_coord[0]+","+src_coord[1]+","+dest_coord[0]+","+ dest_coord[1]+"\n")
            except Exception as e:
                pass
    output.close()


if __name__ == '__main__':
    try:
        import IPython.core.ultratb
    except ImportError:
        # No IPython. Use default exception printing.
        pass
    else:
        import sys
        sys.excepthook = IPython.core.ultratb.ColorTB()
        main()
