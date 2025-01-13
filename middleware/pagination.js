
function paginate(req, res, next) {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const totalPages = Math.ceil(req.paginationResource.length / limitNum);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
        return res.status(400).json({ message: 'Invalid page or limit value' });
    }
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const results = req.paginationResource.slice(startIndex, endIndex);

    const paginatedResults = {
        results: results,
        totalPages: totalPages,
        totalResults: req.paginationResource.length,
    };

    if (pageNum < totalPages) {
        paginatedResults.next = {
            page: pageNum + 1,
            limit: limitNum,
        }
    }

    if (pageNum > 1) {
        paginatedResults.prev = {
            page: pageNum - 1,
            limit: limitNum,
        }
    }

    res.paginatedResults = paginatedResults;
    next();
}

module.exports = {
    paginate,
}