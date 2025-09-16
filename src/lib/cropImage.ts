export const getCroppedImg = (imageSrc: string, crop: any, zoom: number, croppedAreaPixels: any) => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise<string>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("No canvas context");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas is empty");

        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        resolve(URL.createObjectURL(file));
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};
