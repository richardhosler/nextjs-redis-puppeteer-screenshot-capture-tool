import Link from "next/link";
import Image from "next/image";

interface ResultListProps {
  results: string[];
  onSetImage: (_: string) => void;
}

export const ResultList = ({
  results,
  onSetImage,
}: ResultListProps): JSX.Element => {
  return (
    <div className="component">
      <ul className="result-list">
        {results.map((value, index) => {
          return (
            <Link
              key={index}
              href="#"
              onClick={() => {
                onSetImage(value);
              }}
            >
              <li>{value}</li>
            </Link>
          );
        })}
      </ul>
      <Image src="/spacer.png" alt="" width={1} height={1} className="spacer" />
    </div>
  );
};
