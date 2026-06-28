import { useEffect, useState } from "react";
import { useAddress } from "../hooks/useAddress";

const Address = () => {
  const {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    removeAddress,
  } = useAddress();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    area: "",
    landmark: "",
    addressType: "home",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createAddress(form);

    setForm({
      fullName: "",
      mobile: "",
      pincode: "",
      state: "",
      city: "",
      houseNo: "",
      area: "",
      landmark: "",
      addressType: "home",
    });

    fetchAddresses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8">
        My Addresses
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Add Address */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Add Address
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="houseNo"
              value={form.houseNo}
              onChange={handleChange}
              placeholder="House No / Flat"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Area"
              className="w-full border rounded-lg p-3"
            />

            <input
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              placeholder="Landmark"
              className="w-full border rounded-lg p-3"
            />

            <select
              name="addressType"
              value={form.addressType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
            </select>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              Save Address
            </button>

          </form>

        </div>

        {/* Address List */}

        <div>

          <h2 className="text-xl font-semibold mb-5">
            Saved Addresses
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : addresses.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              No Address Found
            </div>
          ) : (
            <div className="space-y-4">

              {addresses.map((address) => (

                <div
                  key={address._id}
                  className="border rounded-xl p-5 shadow-sm"
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="font-bold text-lg">
                        {address.fullName}
                      </h3>

                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {address.addressType}
                      </span>

                    </div>

                    <div className="flex gap-2">

                      <button
                        className="text-blue-600 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => removeAddress(address._id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                  <p className="mt-3">
                    {address.houseNo}, {address.area}
                  </p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>
                    {address.pincode}
                  </p>

                  <p className="mt-2 font-medium">
                    {address.mobile}
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Address;