import Image from "next/image";
import secure from "../../../../app/assest/images/img1.jpeg";
import help from "../../../../app/assest/images/img2.jpeg";
import trust from "../../../../app/assest/images/img3.jpeg";
import delivery from "../../../../app/assest/images/img4.jpeg";
import greate from "../../../../app/assest/images/img5.jpeg";

export default function FeatureSection() {
  return (
    <div className="container mx-auto px-2  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 mt-20">
      <div className=" border border-gray-200 hover:shadow-lg text-center px-4  p-5  text-black rounded-sm">
        <Image
          width={100}
          height={100}
          src={secure}
          alt="secure"
          className="mx-auto h-12 mb-3"
        />
        <h3 className="font-semibold text-lg">100% SECURE PAYMENTS</h3>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
          All major credit & debit cards accepted
        </p>
      </div>

      <div className="border border-gray-200 hover:shadow-lg text-center px-4  p-5  text-black rounded-sm">
        <Image
          width={100}
          height={100}
          src={help}
          alt="help center"
          className="mx-auto h-12 mb-3 "
        />
        <h3 className="font-semibold text-lg">HELP CENTER</h3>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
          Got a question? Look no further. Browse our FAQs or submit your here.
        </p>
      </div>

      <div className="border border-gray-200 hover:shadow-lg text-center px-4  p-5  text-black rounded-sm">
        <Image
          width={100}
          height={100}
          src={trust}
          alt="trustpay"
          className="mx-auto h-12 mb-3"
        />
        <h3 className="font-semibold text-lg">TRUSTPAY</h3>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
          100% Payment Protection. Easy Return Policy
        </p>
      </div>

      <div className="border border-gray-200 hover:shadow-lg text-center px-4  p-5  text-black rounded-sm">
        <Image
          width={100}
          height={100}
          src={delivery}
          alt="worldwide delivery"
          className="mx-auto h-12 mb-3"
        />
        <h3 className="font-semibold text-lg">WORLDWIDE TEACHING</h3>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
          With sites in 5 languages, we ship to over 200 countries & regions.
        </p>
      </div>

      <div className="border border-gray-200 hover:shadow-lg text-center px-4  p-5  text-black rounded-sm">
        <Image
          width={100}
          height={100}
          src={greate}
          alt="great value"
          className="mx-auto h-12 mb-3"
        />
        <h3 className="font-semibold text-lg">GREAT VALUE</h3>
        <p className="text-sm md:text-sm lg:text-lg text-gray-700 mt-4">
          We offer competitive prices on our 100 million plus product range.
        </p>
      </div>
    </div>
  );
}
