import Image from "next/image";
interface ImageViewerProps {
  src: string;
}

export const ImageViewer = ({ src }: ImageViewerProps): JSX.Element => {
  return (
    <div className="component">
      <div className="image-viewer">
        <div className="image-viewer-inner">
          <Image
            src={src}
            alt="Selected image"
            width={960}
            height={500}
            className="image"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};
