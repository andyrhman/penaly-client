function formatCreationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const timeUnits = [
        { unit: 'tahun', value: 365 * 24 * 60 * 60 },
        { unit: 'bulan', value: 30 * 24 * 60 * 60 },
        { unit: 'minggu', value: 7 * 24 * 60 * 60 },
        { unit: 'hari', value: 24 * 60 * 60 },
        { unit: 'jam', value: 60 * 60 },
        { unit: 'menit', value: 60 },
        { unit: 'detik', value: 1 }
    ];

    for (let { unit, value } of timeUnits) {
        const amount = Math.floor(diffInSeconds / value);
        if (amount >= 1) {
            return `${amount} ${unit} yang lalu`;
        }
    }
    return 'Baru saja';
}

export default formatCreationDate;