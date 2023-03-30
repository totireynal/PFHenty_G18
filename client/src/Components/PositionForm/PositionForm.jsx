import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postPositionCrud,
  getPositionsCrud,
  deletePositionCrud,
} from "../../state/redux/actions/actions";

const PositionForm = () => {
  const dispatch = useDispatch();

  const allPositions = useSelector((state) => state.positions);

  const [position, setPosition] = useState({
    position: "",
  });

  const [showList, setShowList] = useState(false);

  const handleChange = (event) => {
    setPosition({
      ...position,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitPost = (event) => {
    event.preventDefault();
    dispatch(postPositionCrud(position));
    setPosition({
      position: "",
    });
  };

  const handleSubmitGet = (event) => {
    event.preventDefault();
    dispatch(getPositionsCrud());
    setShowList(!showList);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-20">
      <form onClick={handleSubmitPost} className="flex flex-col gap-2 w-80">
        <input
          name="position"
          value={position.position}
          onChange={handleChange}
          className="rounded-md border-2 border-gray-800 block px-2 h-12 pl-4 outline-none focus:border-sky-400 resize-none"
          autoComplete="off"
        ></input>
        <button
          type="submit"
          className="bg-sky-400 text-white  rounded overflow-hidden px-16 py-3 active:translate-y-1 active:shadow-2xl shadow-sky-200 hover:bg-sky-300"
        >
          CREATE POSITION
        </button>
      </form>
      <form onClick={handleSubmitGet} className="flex flex-col gap-2 w-80">
        <button
          type="submit"
          className="bg-sky-400 text-white  rounded overflow-hidden px-16 py-3 active:translate-y-1 active:shadow-2xl shadow-sky-200 hover:bg-sky-300"
        >
          {showList ? "HIDE POSITIONS" : "GET POSITIONS"}
        </button>
        {showList && (
          <div>
            <ul>
              {allPositions && allPositions.length > 0 ? (
                allPositions.map((position) => (
                  <div className="relative mb-1">
                    <p
                      key={position.id}
                      className="flex justify-center items-center border rounded h-8 font-semibold border-gray-400 bg-white"
                    >
                      {position.position}
                    </p>
                    <button
                      onClick={() => dispatch(deletePositionCrud(position.id))}
                      className="absolute top-2 right-4 font-semibold text-red-600"
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <p className="flex justify-center items-center  rounded h-8 font-semibold">
                  No positions found
                </p>
              )}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default PositionForm;
